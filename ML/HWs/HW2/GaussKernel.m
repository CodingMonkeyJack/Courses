function [ k ] = GaussKernel(x1, x2, sigma)
k = exp(-norm(x1-x2)/(sigma^2));
end

