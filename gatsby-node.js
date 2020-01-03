const { slugify } = require("./src/utils/utilityFunctions")

exports.onCreatNode = ({ node, actions }) => {
  const { createNodeFlied } = actions
  if (node.internal.type === "MarkdownRemark") {
    const slugifyTitle = slugify(node.frontmatter.title)
    createNodeFlied({
      node,
      name: "slug",
      value: slugifyTitle,
    })
  }
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  const singlePostTemplate = path.resolve('src/templates/single-post.jsx')
  return graphql (`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              author
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `).then(res => {
    if(res.errors) return Promise.reject(res.errors)

    const posts = res.data.allMarkdownRemark.edges

    posts.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: singlePostTemplate,
        contect: {
          slug: node.fields.slug
        }
      })
    });
  })
}
