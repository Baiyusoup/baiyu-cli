module.exports = {
  extends: [
    <%_ if (/(react|vue)/.test(eslintType)) { _%>
    '@antfu',
    <%_ } else if (/typescript/.test(eslintType)) { _%>
    '@antfu/eslint-config-ts',
    <%_ } else { _%>
    '@antfu/eslint-config-basic',
    <%_ } _%>
    'prettier'
  ],
};
