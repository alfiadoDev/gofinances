import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from 'styled-components';

import { HistoryCard } from "../../components/HistoryCard";

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
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
  totalFormatted: string;
  total: number;
  color: string;
  percent: string;
}

const dataKey = '@gofinances:transactions';

export function Resume () {
  const [totalByCategories, steTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();

  async function loadData () {
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];
    
    const expensives = responseFormatted.filter(
      (expensive: TransactionData) => expensive.type === 'negative'
    );

    const expensivesTotal = expensives.reduce((
      acumulator: number,
      expensive: TransactionData
    ) => {
      return acumulator + Number(expensive.amount);
    }, 0)
    
    const totalCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if(category.key === expensive.category)
          categorySum += Number(expensive.amount);
      });

      if(categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${((categorySum / expensivesTotal) * 100).toFixed()}%`;

        totalCategory.push({
          key: category.key,
          name: category.name,
          totalFormatted,
          total: categorySum,
          color: category.color,
          percent,
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
        <ChartContainer>
          <VictoryPie 
            data={totalByCategories}
            colorScale={totalByCategories.map(category => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape
              }
            }}
            labelRadius={50}
            x='percent'
            y='total'
          />
        </ChartContainer>
        {
          totalByCategories.map(item => (
          <HistoryCard 
          key={item.key}
          title={item.name}
          amount={item.totalFormatted}
          color={item.color}
          />
        ))
        }
      </Content>
    </Container>
  );
}