sam
===

SAM for Simple Attribute Modules

Few days ago a friend of mine told me about [AMCSS]. 

Create a js which wrap jquery and override some methods such as addClass / removeClass / hasClass

Use case 
==
SAM('am-button') === $('[am-button=""]')

SAM('am-button*=small') === $('[am-button*="small"]')

SAM('am-Button*=large, am-Button=danger extra-small') === $('[am-button*="small"], [am-button="danger extra-small"]')


[AMCSS]:http://amcss.github.io/
