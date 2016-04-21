Y = [-ones(1000, 1); ones(1000, 1)];
load('train79.mat');
trainData = d79;
load('test79.mat');
testData = d79;
[N, col] = size(trainData);

% sample
ks = [100, 200, 300, 500];
for i = 1: size(ks, 2)
    k = ks(i)
    mu = zeros(col, 1);
    sigma = eye(col);

    trainzxs = ones(N, 2 * k);
    testzxs = ones(N, 2 * k);

    lambda = 0.1;

    W = mvnrnd(mu, sigma, k);

    for i = 1: N
        trainx = trainData(i, :);
        testx = testData(i, :);
        for j = 1: k
            trainzxs(i, j) = cos(W(j, :) * trainx');
            testzxs(i, j) = cos(W(j, :) * testx');
        end
        for j = k + 1: 2 * k
            trainzxs(i, j) = sin(W(j - k, :) * trainx');
            testzxs(i, j) = sin(W(j - k, :) * testx');
        end
        trainzxs(i) = sqrt(trainzxs(i) ./ k);
        testzxs(i) = sqrt(testzxs(i) ./ k);
    end

    W = (trainzxs' * trainzxs + eye(2*k) .* lambda) \ trainzxs' * Y;

    error = 0;

    for i = 1: 1000
        classifyVal = testzxs(i, :) * W;
        if classifyVal > 0
            error = error + 1;
        end
    end

    for i = 1001: 2000
        classifyVal = testzxs(i, :) * W;
        if classifyVal < 0
            error = error + 1;
        end
    end

    errorRate = error * 1.0 / 2000
end
