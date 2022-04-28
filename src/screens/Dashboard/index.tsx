import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';


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
  HighlightCards
} from './styles';


export function Dashboard() {
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
        <HighlightCard />
        <HighlightCard />
        <HighlightCard />
      </HighlightCards>
    </Container>
  )
}