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
    catalogEmpty: 'Your catalog is empty.',
    // Analytics
    insightsPerformance: 'Insights and performance',
    totalCatalogValue: 'Total Catalog Value',
    weeklyViews: 'Weekly Views (Estimated)',
    productsByCategory: 'Products by Category',
    noProductsYet: 'No products yet.',
    // Add Product
    takePhoto: 'Take a Photo',
    recordDetails: 'Record Details',
    backToCamera: 'Back to Camera',
    finalDetails: 'Final Details',
    rawMaterialCost: 'Raw Material Cost (₹)',
    categoryLabel: 'Category',
    back: 'Back',
    submit: 'Submit',
    catTextiles: 'Textiles',
    catPottery: 'Pottery',
    catWoodwork: 'Woodwork',
    catJewelry: 'Jewelry',
    catArt: 'Art',
    catOther: 'Other'
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
    catalogEmpty: 'आपका कैटलॉग खाली है।',
    // Analytics
    insightsPerformance: 'अंतर्दृष्टि और प्रदर्शन',
    totalCatalogValue: 'कुल कैटलॉग मूल्य',
    weeklyViews: 'साप्ताहिक दृश्य (अनुमानित)',
    productsByCategory: 'श्रेणी के अनुसार उत्पाद',
    noProductsYet: 'अभी कोई उत्पाद नहीं।',
    // Add Product
    takePhoto: 'एक तस्वीर लें',
    recordDetails: 'विवरण रिकॉर्ड करें',
    backToCamera: 'कैमरे पर वापस जाएँ',
    finalDetails: 'अंतिम विवरण',
    rawMaterialCost: 'कच्चे माल की लागत (₹)',
    categoryLabel: 'श्रेणी',
    back: 'पीछे',
    submit: 'जमा करें',
    catTextiles: 'कपड़ा',
    catPottery: 'मिट्टी के बर्तन',
    catWoodwork: 'लकड़ी का काम',
    catJewelry: 'आभूषण',
    catArt: 'कला',
    catOther: 'अन्य'
  }
}

export async function getDictionary() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as Language
  return dictionaries[lang] || dictionaries.en
}
