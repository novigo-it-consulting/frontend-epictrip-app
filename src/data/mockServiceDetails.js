import { useState, useEffect } from 'react';
import { translate } from "../services/translations/translateServices";

const useMockData = () => {
  // 1. Adicionamos estados para os dados e para o carregamento
  const [data, setData] = useState({ bookingInfo: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndTranslateData = async () => {
      // Dados originais em inglês
      const originalBookingInfo = [
        {
          title: "Access data",
          content: "32762312"
        },
        {
          title: "Sharing data",
          content: "53613981"
        },
        {
          title: "Useful phones",
          content: "+1 (415) 867-3924"
        }
      ];

      try {
        // Traduz todos os títulos e conteúdos de uma vez
        const translatedInfo = await Promise.all(
          originalBookingInfo.map(async (info) => {
            const [translatedTitle, translatedContent] = await Promise.all([
              translate(info.title, "en"),
              translate(info.content, "en")
            ]);
            return { title: translatedTitle, content: translatedContent };
          })
        );

        setData({ bookingInfo: translatedInfo });

      } catch (error) {
        console.error("Falha ao traduzir os dados do mock:", error);
        // Em caso de erro, usa os dados originais em inglês
        setData({ bookingInfo: originalBookingInfo });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndTranslateData();
  }, []); // O array vazio garante que isso rode apenas uma vez

  // 2. O hook agora retorna os dados e o estado de carregamento
  return { ...data, isLoading };
};

export default useMockData;