Y = [ones(1000, 1); -ones(1000, 1)];
load train79.mat;
W = lsqlin(d79, Y);
load test79.mat;
labels = d79 * W;

error = 0;
for i = 1 : 1000
    if labels(i) < 0
        error = error + 1;
    end
end

for i = 1000 : 2000
    if labels(i) > 0
        error = error + 1;
    end
end
errorRate = error / 2000