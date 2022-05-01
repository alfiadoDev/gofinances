import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native'

import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { InputForm } from "../../components/InputForm";
import { CategorySelect } from "../CategorySelect";


import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Nome e obrigatorio'),
  amount: Yup.number()
    .typeError('Informe um valor numerico')
    .positive('O valor nao pode ser negativo')
    .required('Preco e obrigatorio')
});

const dataKey = '@gofinances:transactions';

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { 
    control,
    handleSubmit,
    formState: { errors },
    reset,
   } = useForm({
     resolver: yupResolver(schema)
   });

  
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const { navigate } : NavigationProp<ParamListBase> = useNavigation();

  function handleTransactionTypeSelect (type: 'up'|'down') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal () {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategory () {
    setCategoryModalOpen(true);
  }

  async function handleRegister (form: FormData) {
    if(!transactionType) 
      return Alert.alert('Selecione o tipo da transacao');

    if(category.key === 'category')
      return Alert.alert('Selecione a categoria');

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const storageData = await AsyncStorage.getItem(dataKey);
      const currentData = storageData ? JSON.parse(storageData) : [];

      const dataToStorage = [
        ...currentData,
        newTransaction,
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataToStorage));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });
      navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert('Nao foi possivel salvar os dados');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm 
              placeholder='Nome'
              name="name"
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm 
              placeholder='Preco'
              name="amount"
              control={control}
              keyboardType="numeric"
              error={errors.name && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton 
                type="up" 
                title="Income"
                onPress={() => handleTransactionTypeSelect('up')}
                isActive={transactionType === 'up'}
              />   
              <TransactionTypeButton 
                type="down" 
                title="Outcome" 
                onPress={() => handleTransactionTypeSelect('down')}
                isActive={transactionType === 'down'}
              />  
            </TransactionsTypes>
            <CategorySelectButton 
              title={category.name}
              onPress={handleOpenSelectCategory}
            /> 
          </Fields>
          <Button title='Enviar' onPress={handleSubmit(formData => 
            handleRegister(formData as FormData))} 
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}