import numpy as np
from scipy.interpolate import UnivariateSpline
import matplotlib.pyplot as pl

# The original fry graph shows number of syllables per 100 words on the x axis,
# and number of sentences per 100 words on the y axis.
# The graph has an underlying cartesian grid. We call the coordinates in this
# grid x_g and y_g.
# The transformation between syllables and x_g is linear
# syl = 33/68*x_g + 108
# x_g = (syl - 108)*33/68
# The transformation between sentences and y_g is nonlinear, we call it f
# sen = f(y_g)
# y_g = f_inv(sen)
#
# The lines bounding the grade areas are linear functions of gx and gy, characterized by a slope and an intercept
# y_g = a*x_g + b
# Applying f to this equation and substituting x_g in terms of syl we find
# sen = f(y_g) = f(a*(syl - 108)*33/68 + b)

#x and y axis in graph units
x_axis = np.array(range(108,176,2))
x_g = np.array(range(len(x_axis)))
y_axis = np.array([2.0,2.5,3.0,3.3,3.5,3.6,3.7,3.8,4.0,4.2,4.3,4.5,4.8,5.0,5.2,5.6,5.9,6.3,6.7,7.1,7.7,8.3,9.1,10.0,11.1,12.5,14.3,16.7,20,25,32])
y_g = np.array(range(len(y_axis)))

f = UnivariateSpline(y_g,y_axis,s=1e-1)

pl.figure()
pl.plot(y_g,y_axis)
pl.plot(y_g,f(y_g))

lines = np.loadtxt("fry_lines.dat")
midline = np.loadtxt("fry_midline.dat")

#numerically transform the delimiting lines to a cartesian grid
n_samples = 32
lines_transformed = np.zeros((lines.shape[0],2,n_samples))
midline_transformed = np.zeros((2,n_samples))
pl.figure()
for l in range(lines.shape[0]):
	x = np.linspace(lines[l,0],lines[l,2],n_samples)
	y = np.linspace(lines[l,1],lines[l,3],n_samples)
	lines_transformed[l,0,:] = 68./33.*x + 108
	lines_transformed[l,1,:] = f(y)
	pl.plot(lines_transformed[l,0,:],lines_transformed[l,1,:])

#the middle line
x = np.linspace(midline[0,0],midline[-1,0],n_samples)
y = np.linspace(midline[0,1],midline[-1,1],n_samples)
midline_transformed[0,:] = 68./33.*x + 108
midline_transformed[1,:] = f(y)
pl.plot(midline_transformed[0,:],midline_transformed[1,:])

def write_line_data(x,y,format='%.3f'):
	dicts = map(lambda t: ("{x: %s, y: %s}" % (format,format)) % t,zip(x,y))
	return "{points: [" + ",".join(dicts) + "]}"

#write out transformed data
fid = open("isolines.dat","w")
fid.write("var isolines = [\n")
for i in range(lines.shape[0]):
	fid.write(write_line_data(lines_transformed[i,0,:],lines_transformed[i,1,:]))
	fid.write(",\n")
fid.write("];\n\n")
fid.write("var midline = \n")
fid.write(write_line_data(midline_transformed[0,:],midline_transformed[1,:]))
fid.write(";\n")
fid.close()

#pl.show()
