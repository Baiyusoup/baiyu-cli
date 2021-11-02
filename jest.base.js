module.exports = {
  // 收集测试时的覆盖率信息
  collectCoverage: true,

  // 指定收集覆盖率的目录
  collectCoverageFrom: ['**/lib/**', '!**/dist/**'],

  // 指定输出覆盖信息文件的目录
  coverageDirectory: 'coverage',

  // 测试文件匹配规则
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],

  // 忽略测试路径
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
};
