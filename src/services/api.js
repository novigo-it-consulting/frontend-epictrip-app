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
      Authorization: `Bearer ${await AsyncStorage.getItem("changePasswordToken")}`,
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

export const requestGetbooking = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = await axios.get(`${BASE_URL}/bookings`, {
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

    const selectedFile = file.assets[0];

    // Criar um objeto FormData para enviar a imagem
    const formData = new FormData();
    formData.append("file", {
      uri: selectedFile.uri, // A URI do arquivo
      type: selectedFile.mimeType, // O tipo do arquivo
      name: selectedFile.fileName, // Nome do arquivo
    });

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
      `${BASE_URL}/paymentmethods/${dados.methodId}`,
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
    if (response.status == 200){
      return response;
    } else if (response.status == 404) {
      return "noCardsFound";
    } else {
      return response
    }
    
  } catch (error) {
    throw error;
  }
};

export const requestPayment = async (userId, paymentMethodId, amount) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const data = JSON.stringify({
      userId: userId,
      paymentMethod: paymentMethodId,
      amount: amount,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/charges`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
   
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestGetBookingByUser = async (userId) => {
  try{
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = await axios.get(`${BASE_URL}/bookings/user/${userId}`, { headers })
    return response
  } catch (error) {
    throw error;
  }
}
export const requestGetHousesByBooking = async (houseId) => {
  try{
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = await axios.get(`${BASE_URL}/houses/${houseId}`, { headers })
    return response
  } catch (error) {
    throw error;
  }
}

export const requestChangePasswordToken = async (userId) => {
  try{
    const headers = {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    };
    const response = await axios.get(`${BASE_URL}/passwordtokens/${userId}`, { headers })
    return response
  } catch (error) {
    throw error;
  }
}
