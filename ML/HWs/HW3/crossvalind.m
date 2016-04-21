function [trainLabels, testLabels] = crossvalind(N, percent)
M = N * percent;
testLabels = randsample(N, M);
trainLabels = zeros(N - M, 1);
j = 1;
for i = 1: N
    if ismember(i, testLabels) == 0
        trainLabels(j) = i;
        j = j + 1;
    end
end
end

