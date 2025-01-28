import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

export const getSampleData = (t) => {
  return [
    {
      id: 1,
      title: t("sampleData.categoryBooking"),
      icon: () => <Entypo name="home" size={24} color="#0065FF" />,
    },
    {
      id: 2,
      title: t("sampleData.categoryServices"),
      icon: () => < Entypo name="suitcase" size={24} color="#0065FF" />
    },
    {
      id: 3,
      title: t("sampleData.categoryConcierge"),
      icon: () => < AntDesign name="customerservice" size={24} color="#0065FF" />
    },
    {
      id: 4,
      title: t("sampleData.categoryTickets"),
      icon: () => < Entypo name="ticket" size={24} color="#0065FF" />
    },
    {
      id: 5,
      title: t("sampleData.categoryPlaces"),
      icon: () => < Entypo name="location" size={24} color="#0065FF" />
    },
    {
      id: 6,
      title: t("sampleData.categoryFood"),
      icon: () => < Entypo name="bowl" size={24} color="#0065FF" />
    },
    {
      id: 7,
      title: t("sampleData.categoryShop"),
      icon: () => <Entypo name="shopping-basket" size={24} color="#0065FF" />
    },
    {
      id: 8,
      title: "Claim",
      icon: () => < Entypo name="megaphone" size={24} color="#0065FF" />
    },
  ];
};
