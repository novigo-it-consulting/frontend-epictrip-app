import { useTranslation } from 'react-i18next'; // Importando função de tradução

const useMockData = () => {
  const { t } = useTranslation(); // Função de tradução do i18next

  const mockData = {
    bookingInfo: [
      {
        title: t('bookingInfo.acordionOne.title'), // Dados de Acesso
        content: t('bookingInfo.acordionOne.content') // Descrição sobre dados de acesso
      },
      {
        title: t('bookingInfo.acordionTwo.title'), // Compartilhamento de dados
        content: t('bookingInfo.acordionTwo.content') // Descrição sobre compartilhamento de dados
      },
      {
        title: t('bookingInfo.acordionThree.title'), // Telefones Úteis
        content: t('bookingInfo.acordionThree.content') // Lista de números úteis
      }
    ]
  };

  return mockData;
};

export default useMockData;
