import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';


import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreating,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
} from './styles';
import { useFocusEffect } from '@react-navigation/native';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  total: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensive: HighlightProps;
  balanceTotal: string;
}

const dataKey = '@gofinances:transactions';

export function Dashboard() {
  const [transactions,setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>
    ({
      entries: {
        total: '0'
      },
      expensive: {
        total: '0'
      },
      balanceTotal: '0'
    } as HighlightData);

  let entrieTotal = 0;
  let expensiveTotal = 0;

  async function loadTransactions () {
    const response = await AsyncStorage.getItem(dataKey);
    const transactionsStorage = response ? JSON.parse(response) : [];

    const formatedTransactions: DataListProps[] = transactionsStorage.map(
      (item: DataListProps) => {
        if(item.type === 'positive')
          entrieTotal = Number(item.amount) + entrieTotal;
        else
          expensiveTotal = Number(item.amount) + expensiveTotal;

        const amount = Number(item.amount)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });
        
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTransactions(formatedTransactions);
    setHighlightData({
      expensive: {
        total: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      entries: {
        total: entrieTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      balanceTotal: (entrieTotal - expensiveTotal).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
    });
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  // useFocusEffect(useCallback(() => {
  //   loadTransactions();
  // }, []));

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/61153857?v=4' }} />
            <User>
              <UserGreating>Ola,</UserGreating>
              <UserName>Alfiado</UserName>
            </User>
          </UserInfo>

          <LogoutButton>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard 
          type='up'
          title='Entradas' 
          amount={highlightData.entries.total} 
          lastTransaction='Última entrada dia 13 de abril'
        />
        <HighlightCard
          type="down" 
          title='Saidas' 
          amount={highlightData.expensive.total}  
          lastTransaction='Última saída dia 03 de abril'
        />
        <HighlightCard
          type="total" 
          title='Total' 
          amount={highlightData.balanceTotal} 
          lastTransaction='01 à 16 de abril'
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList 
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  )
}