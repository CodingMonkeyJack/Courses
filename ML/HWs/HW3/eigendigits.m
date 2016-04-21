load('train79.mat');
trainData = d79;
load('test79.mat');
testData = d79;
X1 = [trainData(1: 1000, :); testData(1: 1000, :)];
X2 = [trainData(1001: 2000, :); testData(1001: 2000, :)];
X3 = [X1; X2];
X = X3;

X = X';
X = bsxfun(@minus, X, mean(X, 2));
s = cov(X');
[V, D] = eig(s);
[D order] = sort(diag(D), 'descend');       
V = V(:, order);

figure,subplot(1, 2, 1)
colormap gray
for i = 1:2
    subplot(1, 2, i)
    imagesc(reshape(V(:, i), 28, 28))
end