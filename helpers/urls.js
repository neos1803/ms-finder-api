const urls_object =  {
  // `https://www.tokopedia.com/search?navsource=home&sc=3309&source=universe&st=product&q=${req.params.name.replace(/\s/g, '%20')}`
  tokopedia: `https://www.tokopedia.com/search?navsource=home&sc=3309&source=universe&st=product&q=`,
  // `https://www.bukalapak.com/c/hobi-koleksi/buku/komik?search%5Bkeywords%5D=${req.params.name.replace(/\s/g, '%20')}`
  shopee: `https://shopee.co.id/search?facet=16895%2C16893&keyword=`,
  // `https://shopee.co.id/search?facet=16895%2C16893&keyword=${req.params.name.replace(/\s/g, '%20')}`
  bukalapak: `https://www.bukalapak.com/c/hobi-koleksi/buku/komik?search%5Bkeywords%5D=`
}

module.exports = urls_object;