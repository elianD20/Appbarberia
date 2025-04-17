import axios from 'axios';

import JSEncrypt from 'jsencrypt';



const CLIENT_ID = 'bjaUHeH9v3yVYMCPsQIrakFFwbmRRity';

const CLIENT_SECRET = `-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5Yd14kuawM8NJxFJwp8SnAZ9Muw0/YWdm0Pt7PIHCWWwQNVN5sKfASZMWW5uKy701az/rrqt1M/N4hpfGlynxzL2B87wCv8NVkDhpez1pwS2+v5rQyjhQnzmJVvenlEqZhNm9GU9Vs5e6asYJXtjfyaaq82HUny1P3BGsX40ipwIDAQAB-----END PUBLIC KEY-----`;



const generateIdToken = () => {

  try {

    let encrypt = new JSEncrypt();

    const formattedPublicKey = CLIENT_SECRET.replace(/(\r\n|\n|\r)/gm, "");

    encrypt.setPublicKey(formattedPublicKey);



    const timestamp = new Date().getTime();

    const dataToEncrypt = `client_id=${CLIENT_ID}&timestamp=${timestamp}`;

    console.log("️ Datos a encriptar:", dataToEncrypt);



    const encrypted = encrypt.encrypt(dataToEncrypt);



    if (!encrypted) {

      throw new Error("Error al encriptar client_secret.");

    }



    console.log("️ id_token generado:", encrypted);

    return encrypted;

  } catch (error) {

    console.error("Error al generar id_token:", error);

    return null;

  }

};



export const getAccessToken = async () => {

  try {

    const id_token = generateIdToken();

    if (!id_token) return null;



    console.log(" Solicitando access_token...");



    const response = await axios.post(

      'https://yce-api-01.perfectcorp.com/s2s/v1.0/client/auth',

      { client_id: CLIENT_ID, id_token: id_token },

      { headers: { "Content-Type": "application/json" } }

    );



    console.log(" Respuesta de access_token:", response);



    if (response.data && response.data.result && response.data.result.access_token) {

      console.log(" Access Token recibido:", response.data.result.access_token);

      return response.data.result.access_token;

    } else {

      console.error("No se recibió access_token en la respuesta.");

      return null;

    }

  } catch (error) {

    console.error("Error al obtener el token:", error.response ? error.response : error.message);

    return null;

  }

};



export const uploadImage = async (imageUri, accessToken) => {

  const formData = new FormData();

  formData.append('files', [

    {

      uri: imageUri,

      name: 'photo.jpg',

      type: 'image/jpeg',

    }

  ]);



  try {

    const response = await axios.post(

      'https://yce-api-01.perfectcorp.com/s2s/v1.1/file/hair-style',

      formData,

      {

        headers: {

          'Authorization': `Bearer ${accessToken}`,

          'Content-Type': 'multipart/form-data',

        },

      }

    );



    console.log("Respuesta de subida de imagen:", response.data);

    return response.data.result.files[0].file_id;

  } catch (error) {

    console.error('Error al subir la imagen:', error.response ? error.response.data : error.message);

    return null;

  }

};



export const getHairStyleOptions = async (accessToken) => {

  try {

    const response = await axios.get(

      'https://yce-api-01.perfectcorp.com/s2s/v1.0/task/style-group/hair-style',

      {

        headers: { 'Authorization': `Bearer ${accessToken}` }

      }

    );



    console.log("Estilos disponibles:", response.data.result.groups);

    return response.data.result.groups;

  } catch (error) {

    console.error('Error al obtener estilos de peinado:', error.response ? error.response.data : error.message);

    return null;

  }

};



export const simulateHaircut = async (fileId, styleGroupId, styleId, accessToken) => {

  try {

    const response = await axios.post(

      'https://yce-api-01.perfectcorp.com/s2s/v1.0/task/hair-style',

      {

        request_id: 0,

        payload: {

          file_sets: { src_ids: [fileId] },

          actions: [

            { id: 0, parameters: { style_group_id: styleGroupId, style_ids: [styleId] } }

          ]

        }

      },

      {

        headers: { 'Authorization': `Bearer ${accessToken}` }

      }

    );



    console.log("Task ID generado:", response.data.result.task_id);

    return response.data.result.task_id;

  } catch (error) {

    console.error('Error al iniciar la simulación:', error.response ? error.response.data : error.message);

    return null;

  }

};



export const getSimulationResult = async (taskId, accessToken) => {

  try {

    const response = await axios.get(

      `https://yce-api-01.perfectcorp.com/s2s/v1.0/task/hair-style?task_id=${taskId}`,

      {

        headers: { 'Authorization': `Bearer ${accessToken}` }

      }

    );



    if (response.data.result.status === "success") {

      console.log("Imagen generada:", response.data.result.results[0].data[0].url);

      return response.data.result.results[0].data[0].url;

    }



    return null;

  } catch (error) {

    console.error('Error al obtener la imagen generada:', error.response ? error.response.data : error.message);

    return null;

  }

};



export const getStylesByGroupId = async (groupId, accessToken) => {

  try {

    const response = await axios.get(

      `https://yce-api-01.perfectcorp.com/s2s/v1.0/task/style/hair-style?style_group_id=${groupId}`,

      {

        headers: { 'Authorization': `Bearer ${accessToken}` }

      }

    );



    console.log("Estilos del grupo:", response.data.result.styles);

    return response.data.result.styles;

  } catch (error) {

    console.error('Error al obtener estilos del grupo:', error.response ? error.response.data : error.message);

    return null;

  }

};