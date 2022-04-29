import React from 'react';

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
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [
    {
      id: '1',
      type: 'positive',
      title:'Desenvolvimento de Site',
      amount:'R$ 12.000,00',
      category:{
        name: 'Vendas',
        icon: 'dollar-sign',
      },
      date:'13/04/2022'
    },
    {
      id: '2',
      type: 'negative',
      title:'Desenvolvimento de Site',
      amount:'R$ 12.000,00',
      category:{
        name: 'Vendas',
        icon: 'shopping-bag',
      },
      date:'13/04/2022'
    },
    {
      id: '3',
      type: 'negative',
      title:'Desenvolvimento de Site',
      amount:'R$ 12.000,00',
      category:{
        name: 'Vendas',
        icon: 'coffee',
      },
      date:'13/04/2022'
    },
  ];

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

          <Icon name="power" />
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