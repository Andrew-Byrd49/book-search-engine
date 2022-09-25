import { gql } from '@apollo/client';

export const login_user = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const add_user = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const save_book = gql`
  mutation saveBook($input: saveBookInput!) {
    saveBook(input: $input) {
    }
  }
`;

export const remove_book = gql