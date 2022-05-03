import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';

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
  LoadContainer
} from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  total: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensive: HighlightProps;
  balanceTotal: string;
  totalDate: string;
}

const dataKey = '@gofinances:transactions';

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions,setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();

  let entrieTotal = 0;
  let expensiveTotal = 0;

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive'|'negative'
  ) {
    const lastTransactions = 
    new Date(
    Math.max.apply(Math,
      collection
      .filter(
        transaction => transaction.type === type
      ).map(transaction => new Date(transaction.date).getTime())
    ));
    return `${lastTransactions.getDay()} de ${lastTransactions.toLocaleDateString(
      'pt-BR',
      {
        month: 'long'
      }
    )}`;
  }

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

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
    const total = `01 a ${lastTransactionExpensives}`

    setHighlightData({
      expensive: {
        total: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Ultima Saida dia ${lastTransactionExpensives}`
      },
      entries: {
        total: entrieTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Ultima Entrada dia ${lastTransactionEntries}`
      },
      balanceTotal: (entrieTotal - expensiveTotal).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
      totalDate: total
    });
    setIsLoading(false);
    entrieTotal = 0;
    expensiveTotal = 0;
  }

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator
            size='large'  
            color={theme.colors.primary} 
          />
        </LoadContainer> :
        <>
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
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard
              type="down" 
              title='Saidas' 
              amount={highlightData.expensive.total}  
              lastTransaction={highlightData.expensive.lastTransaction}
            />
            <HighlightCard
              type="total" 
              title='Total' 
              amount={highlightData.balanceTotal} 
              lastTransaction={highlightData.totalDate}
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
        </>
      }
    </Container>
  )
}