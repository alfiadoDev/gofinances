import React from 'react';
import { getBottomSpace } from 'react-native-iphone-x-helper';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard } from '../../components/TransactionCard';


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


export function Dashboard() {
  const data = [
    {
      title:'Desenvolvimento de Site',
      amount:'R$ 12.000,00',
      category:{
        name: 'Vendas',
        icon: 'dollar',
      },
      date:'13/04/2022'
    },
    {
      title:'Desenvolvimento de Site',
      amount:'R$ 12.000,00',
      category:{
        name: 'Vendas',
        icon: 'dollar',
      },
      date:'13/04/2022'
    },
    {
      title:'Desenvolvimento de Site',
      amount:'R$ 12.000,00',
      category:{
        name: 'Vendas',
        icon: 'dollar',
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
          renderItem={({ item }) => <TransactionCard data={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: getBottomSpace()
          }}
        />
      </Transactions>
    </Container>
  )
}