import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "https://qa-backend.myepictrip.app";

export const requestSignUpGuest = async (dados) => {
  try {
    const headers = {
      "content-Type": "application/json",
    };
    const response = await axios.post(`${BASE_URL}/users/guests`, dados, {
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestLogin = async (dados) => {
  try {
    const headers = {
      "content-Type": "application/json",
    };
    const response = await axios.post(`${BASE_URL}/users/login`, dados, {
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestGenerateToken = async (dados) => {
  console.log("dados: ", dados);
  try {
    const response = await axios.post(
      `${BASE_URL}/passwordtokens/generatetoken/${dados.username}`
    );
    return response.status;
  } catch (error) {
    throw error;
  }
};

export const requestValidateToken = async (dados) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/passwordtokens/checktoken/${dados.token}`
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const requestChangePassword = async (dados) => {
  try {
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${BASE_URL}/users/changepassword`,
      dados,
      {
        headers,
      }
    );
    return response.status;
  } catch (error) {
    throw error;
  }
};

export const requestGetUser = async (userId) => {
  try {
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const changeProfilePic = async (file) => {
  try {
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };

    // Criar um objeto FormData para enviar a imagem
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${BASE_URL}/users/profilepic`,
      formData,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// api.js
export const requestUpdateUser = async (userId, dados) => {
  try {
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = await axios.put(`${BASE_URL}/users/${userId}`, dados, {
      headers,
    });

    console.log("Response", response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestCreatePaymentMethod = async (dados) => {
  try {
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = axios.post(`${BASE_URL}/paymentmethods/`, dados, {
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestUpdatePaymentMethod = async (dados) => {
  try {
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = axios.put(
      `${BASE_URL}/paymentmethods/${dados.paymentMethodId}`,
      dados,
      { headers }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestDeletePaymentMethod = async (paymentMethodId) => {
  try {
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = axios.delete(
      `${BASE_URL}/paymentmethods/${paymentMethodId}`,
      { headers }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestGetMethodById = async (paymentMethodId) => {
  try {
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = axios.get(
      `${BASE_URL}/paymentmethods/${paymentMethodId}`,
      { headers }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestGetMethodsByUser = async (userId) => {
  try {
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = axios.get(
      `${BASE_URL}/paymentmethods/getmethodsbyuser/${userId}`,
      { headers }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
