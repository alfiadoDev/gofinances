import React, { useEffect, useState } from 'react';
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

export interface DataListProps extends TransactionCardProps {
  id: string;
}

const dataKey = '@gofinances:transactions';

export function Dashboard() {
  const [data,setData] = useState<DataListProps[]>([]);

  async function loadTransactions () {
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const formatedTransactions: TransactionCardProps = transactions.map(
      (item: DataListProps) => {
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

    setData(formatedTransactions);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

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
          amount='R$ 17.400,00' 
          lastTransaction='Última entrada dia 13 de abril'
        />
        <HighlightCard
          type="down" 
          title='Saidas' 
          amount='R$ 1.259,00' 
          lastTransaction='Última saída dia 03 de abril'
        />
        <HighlightCard
          type="total" 
          title='Total' 
          amount='R$ 16.141,00' 
          lastTransaction='01 à 16 de abril'
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList 
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  )
}