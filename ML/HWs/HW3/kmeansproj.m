load('test79.mat');
testData = d79;

ks = [2, 5, 10, 50];
for kIdx = 1: size(ks, 2)
    error = 0;
    k = ks(kIdx);
    clusterLabels = kmeans(testData, k);
    clusterNums = zeros(k, 1);
    for i = 1: 1000
        label = clusterLabels(i);
        clusterNums(label) = clusterNums(label) + 1;
    end
    [maxVal, maxIdx] = max(clusterNums);
    error = 1000 - maxVal;
    
    clusterNums = zeros(k, 1);
    for i = 1001: 2000
        label = clusterLabels(i);
        clusterNums(label) = clusterNums(label) + 1;
    end
    [maxVal, maxIdx] = max(clusterNums);
    error = error + 1000 - maxVal;
    error = error * 1.0 / 2000
end