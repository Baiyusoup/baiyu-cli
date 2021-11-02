husky install
npx huksy add .husky/pre-commit 'npx lint-staged'
npx husky add .husky/commit-msg 'npm run lint'