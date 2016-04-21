Y = [ones(1000, 1); -ones(1000, 1)];
load('train79.mat');
trainData = d79;
load('test79.mat');
testData = d79;

coeffs = pca(trainData);
cdata = [ones(1000, 1) * [1 0 0]; ones(1000, 1) * [0 0 1]];
scatter(trainData * coeffs(:, 1), trainData * coeffs(:, 2), 'o', 'cdata', cdata)