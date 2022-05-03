import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from "../../components/HistoryCard";

import {
  Container,
  Header,
  Title,
  Content,
} from './styles';
import { categories } from "../../utils/categories";

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: string;
  color: string;
}

const dataKey = '@gofinances:transactions';

export function Resume () {
  const [totalByCategories, steTotalByCategories] = useState<CategoryData[]>([])

  async function loadData () {
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];
    
    const expensives = responseFormatted.filter(
      (expensive: TransactionData) => expensive.type === 'negative'
    );
    
    const totalCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if(category.key === expensive.category)
          categorySum += Number(expensive.amount);
      });

      if(categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        totalCategory.push({
          key: category.key,
          name: category.name,
          total,
          color: category.color
        });
      }
    });

    steTotalByCategories(totalCategory);
  }
  
  useEffect(() => {
    loadData();
  });

  return (
    <Container>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>

      <Content>
        {
          totalByCategories.map(item => (
          <HistoryCard 
          key={item.key}
          title={item.name}
          amount={item.total}
          color={item.color}
          />
        ))
        }
      </Content>
    </Container>
  );
}