Y = [zeros(1000,1); ones(1000,1)];
load train79.mat;
SVMModel = fitcsvm(d79, Y,'KernelFunction','linear','Standardize',true,'ClassNames',{'0','1'});
load test79.mat;
[labels,score] = predict(SVMModel,d79);
error = 0;
for i = 1 : 1000
    if(labels{i} ~= '0')
        error = error + 1;
    end
end

for i = 1000 : 2000
    if(labels{i} ~= '1')
        error = error + 1;
    end
end
errorRate = error / 2000; 