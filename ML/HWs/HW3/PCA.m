load('train79.mat');
trainData = d79;

trainData = bsxfun(@minus, trainData, mean(trainData, 1));           
C = cov(trainData);

[V D] = eig(C);
[D order] = sort(diag(D), 'descend');       
V = V(:, order);

trainData = trainData * V(:, 1: 2);
cdata = [ones(1000, 1) * [1 0 0]; ones(1000, 1) * [0 0 1]];
size(trainData)
scatter(trainData(:, 1), trainData(:, 2), 'o', 'cdata', cdata)

