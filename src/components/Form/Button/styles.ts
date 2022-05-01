import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import { RectButton } from 'react-native-gesture-handler';
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export const Container = styled(RectButton)<ContainerProps>`
  align-items: center;

  width: 100%;
  padding: 18px;

  background-color: ${({ theme }) => theme.colors.secondary};

  border-radius: 5px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.shape};
`;