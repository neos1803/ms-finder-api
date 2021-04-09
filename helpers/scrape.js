function scrapeTextOrAttr ($, e, find, attr = Boolean, attrValue = null) {
  if (attr) {
    return $(e)
      .find(find)
      .attr(attrValue)
  }
  return $(e)
    .find(find)
    .text()
}

module.exports = scrapeTextOrAttr;