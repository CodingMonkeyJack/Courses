Y = [ones(1000,1); -ones(1000,1)];
load('train79.mat');
trainData = d79;
load('test79.mat');
testData = d79;

N = size(trainData, 1);
M = size(trainData, 2);
percent = 0.1;
[TrainInd, TestInd] = crossvalind(N, percent);
trainTrainN = size(TrainInd, 1);
trainTestN = size(TestInd, 1);
trainTrainData = zeros(trainTrainN, M);
trainTrainYs = zeros(trainTrainN, 1);
trainTestData = zeros(trainTestN, M);

for i = 1: trainTrainN
    trainTrainData(i, :) = trainData(TrainInd(i), :);
    if TrainInd(i) <= 1000
        trainTrainYs(i) = 1;
    else
        trainTrainYs(i) = -1;
    end
end
for i = 1: trainTestN
    trainTestData(i, :) = trainData(TestInd(i), :);
end

treeNum = 10;
B = TreeBagger(treeNum, trainTrainData, trainTrainYs);
predTrainLabels = predict(B, trainTestData);
trainError = 0;

for i = 1 : trainTestN
    if TestInd(i) <= 1000
        trueLabel = 1;
    else
        trueLabel = -1;
    end
    if str2double(predTrainLabels{i}) ~= trueLabel
        trainError = trainError + 1;
    end
end
trainError = trainError * 1.0 / trainTestN

testN = size(testData, 1);
predTestLabels = predict(B, testData);
testError = 0;
for i = 1: testN
    if i <= 1000
        trueLabel = 1;
    else
        trueLabel = -1;
    end
    if str2double(predTestLabels{i}) ~= trueLabel
        testError = testError + 1;
    end
end
testError = testError * 1.0 / testN
