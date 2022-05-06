import React, { useCallback, useState } from 'react';
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
import { useAuth } from '../../hooks/auth';

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


export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions,setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();
  const { user, signOut } = useAuth();

  const dataKey = `@gofinances:transactions_user:${user.id}`;

  let entrieTotal = 0;
  let expensiveTotal = 0;

  function getLastTransactionDateByType(
    collection: DataListProps[],
    type: 'positive'|'negative',
  ) {
    const collectionFilttered = collection
    .filter(
      transaction => transaction.type === type
    );
    
    if(collectionFilttered.length === 0)
      return 0;

    const lastTransactions = 
    new Date(
    Math.max.apply(Math,
      collectionFilttered
      .map(transaction => new Date(transaction.date).getTime())
    ));
    return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleDateString(
      'pt-BR',
      {
        month: 'long'
      }
    )}`;
  }

  function getLastTransactionDate(
    collection: DataListProps[],
  ) {
    
    if(collection.length === 0)
      return 0;

    const transaction = collection[0];

    const lastTransaction = new Date(transaction.date);

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleDateString(
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

    const lastTransactionEntries = getLastTransactionDateByType(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDateByType(transactions, 'negative');
    const lastTransactionTotal = getLastTransactionDate(transactions);
    const total = lastTransactionTotal === 0 ? 'Nao ha Transacoes' : `01 a ${lastTransactionTotal}`
    setHighlightData({
      expensive: {
        total: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensives === 0 ? 'Nao ha Transacoes' :
        `Ultima Saida dia ${lastTransactionExpensives}`
      },
      entries: {
        total: entrieTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === 0 ? 'Nao ha Transacoes' : 
        `Ultima Entrada dia ${lastTransactionEntries}`
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
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreating>Ola,</UserGreating>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
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