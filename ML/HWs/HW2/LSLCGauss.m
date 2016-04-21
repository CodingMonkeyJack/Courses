load('train79.mat');
trainData = d79;
load('test79.mat');
testData = d79;

N = size(trainData, 1);
percent = 0.1;

sigmas = [10, 100, 500, 1000, 1500];
lamdas = [0.1, 0.5, 1, 2];
for lidx = 1: size(lamdas, 2)
    lamda = lamdas(lidx);
    disp('lamba:');
    lamda
    for idx = 1: size(sigmas, 2)
        % train
        sigma = sigmas(idx);
        disp('sigma:');
        sigma
        
        [TrainInd, TestInd] = crossvalind(N, percent);
        trainN = size(TrainInd, 1);
        K = zeros(trainN, trainN);
        I = eye(trainN);
        Y = zeros(trainN, 1);
        
        for i = 1: trainN
            iIdx = TrainInd(i);
            if iIdx <= 1000
                Y(i) = 1;
            else
                Y(i) = -1;
            end
            for j = 1: trainN
                jIdx = TrainInd(j);
                K(i, j) = GaussKernel(trainData(iIdx,:), trainData(jIdx,:), sigma);
            end
        end
        W = (K + lamda * I) \ Y;
        
        % train error
        testN = size(TestInd, 1);
        trainError = 0;
        for i = 1: testN
            iIdx = TestInd(i);
            p = zeros(trainN, 1);
            for j = 1: trainN
                jIdx = TrainInd(j);
                p(j) = GaussKernel(trainData(iIdx,:), trainData(jIdx,: ), sigma);
            end
            val = W' * p;
            if val < 0
                classifyLab = -1;
            else
                classifyLab = 1;
            end
            if iIdx <= 1000
                correctLab = 1;
            else
                correctLab = -1;
            end
            if correctLab ~= classifyLab
                trainError = trainError + 1;
            end
        end
        disp('train error:');
        trainErrorRate = trainError / testN
        
        % test error
        testError = 0;
        for i = 1: N
            p = zeros(trainN, 1);
            for j = 1: trainN
                jIdx = TrainInd(j);
                p(j) = GaussKernel(testData(i,:), trainData(jIdx,:), sigma);
            end
            val = W' * p;
            if val < 0
                classifyLab = -1;
            else
                classifyLab = 1;
            end
            if i <= 1000
                correctLab = 1;
            else
                correctLab = -1;
            end
            if correctLab ~= classifyLab
                testError = testError + 1;
            end
        end
        disp('test error:');
        testErrorRate = testError * 1.0 / N
    end
end
