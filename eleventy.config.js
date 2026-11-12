export default function(eleventyConfig) {
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough")
  eleventyConfig.addPassthroughCopy("site.css")
  eleventyConfig.addPassthroughCopy("site.js")
  eleventyConfig.addPassthroughCopy("avatar.png")
}
