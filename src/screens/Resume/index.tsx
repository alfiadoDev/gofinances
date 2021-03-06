import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from 'styled-components';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { HistoryCard } from "../../components/HistoryCard";

import {
  Container,
  LoadContainer,
  Header,
  Title,
  Content,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  ChartContainer,
} from './styles';
import { categories } from "../../utils/categories";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

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


export function Resume () {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, steTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();
  const { user } = useAuth();

  const dataKey = `@gofinances:transactions_user:${user.id}`;

  function handleDateChange (action: 'next'|'prev') {
    if(action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    }else{
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData () {
    setIsLoading(true);
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];
    
    const expensives = responseFormatted.filter(
      (expensive: TransactionData) => 
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
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
    setIsLoading(false);
  }
  
  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));

  return (
    <Container>
        <Header>
          <Title>Resumo por Categoria</Title>
        </Header>

          {
            isLoading ? 
            <LoadContainer>
              <ActivityIndicator
                size='large'  
                color={theme.colors.primary} 
              />
            </LoadContainer> :
            <Content
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: useBottomTabBarHeight(),
              }}
            >
              <MonthSelect>
                <MonthSelectButton onPress={() => handleDateChange('prev')}>
                  <MonthSelectIcon name='chevron-left' />
                </MonthSelectButton>

                <Month>
                  { format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }
                </Month>
                
                <MonthSelectButton onPress={() => handleDateChange('next')}>
                  <MonthSelectIcon name='chevron-right' />
                </MonthSelectButton>
              </MonthSelect>

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
        }
    </Container>
  );
}