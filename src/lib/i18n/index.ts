import { cookies } from 'next/headers'

export type Language = 'en' | 'hi'

export const dictionaries = {
  en: {
    welcome: 'Welcome back',
    published: 'Published',
    analytics: 'Analytics',
    recentProducts: 'Recent Products',
    viewAll: 'View All',
    noProducts: "You haven't listed any products yet.",
    addFirstProduct: 'Add your first product',
    menu: 'Menu',
    myProfile: 'My Profile',
    languagePref: 'Language Preference',
    helpSupport: 'Help & Support',
    logout: 'Log Out',
    home: 'Home',
    catalog: 'Catalog',
    add: 'Add',
    more: 'More',
    myCatalog: 'My Catalog',
    productsListed: 'products listed',
    catalogEmpty: 'Your catalog is empty.'
  },
  hi: {
    welcome: 'वापसी पर स्वागत है',
    published: 'प्रकाशित',
    analytics: 'एनालिटिक्स',
    recentProducts: 'हाल के उत्पाद',
    viewAll: 'सभी देखें',
    noProducts: "आपने अभी तक कोई उत्पाद सूचीबद्ध नहीं किया है।",
    addFirstProduct: 'अपना पहला उत्पाद जोड़ें',
    menu: 'मेनू',
    myProfile: 'मेरी प्रोफ़ाइल',
    languagePref: 'भाषा',
    helpSupport: 'मदद और समर्थन',
    logout: 'लॉग आउट',
    home: 'होम',
    catalog: 'कैटलॉग',
    add: 'जोड़ें',
    more: 'अधिक',
    myCatalog: 'मेरा कैटलॉग',
    productsListed: 'उत्पाद सूचीबद्ध हैं',
    catalogEmpty: 'आपका कैटलॉग खाली है।'
  }
}

export async function getDictionary() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as Language
  return dictionaries[lang] || dictionaries.en
}
