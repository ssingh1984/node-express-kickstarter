module.exports =  {
    random : function (len) {
        var text = " ";
        var charset = "123456789";
        for( var i=0; i < len; i++ )
            text += charset.charAt(Math.floor(Math.random() * charset.length));
            return text;
    },
    cryptr : function (text, type, outText) {
        var Cryptr = require('cryptr');
        cryptr = new Cryptr('android-watchKey');
        if(type == 'cryptr')
        {
            return cryptr.encrypt(text);
        }
        else
        {
            console.log('------------',text);

            if(typeof(text) == 'object')
            {
                console.log('**********', typeof(text));
                var output = {};
                var newText = JSON.parse(JSON.stringify(text));
                console.log('++++++++',newText);
                for(var i in newText)
                {
                    for(var j in outText)
                    {
                        if(outText[j] == i)
                        {
                            output[i] = cryptr.decrypt(newText[i]);
                        }
                    }
                }
                return output;
            }
            else
            {
                //console.log('dcrypt-----', cryptr.decrypt(text));
                try {
                   return cryptr.decrypt(text)
                }
                catch(err){
                    return 0;
                }

            }

        }
    },
    jwtSecret: 'jWtSeCrEtAnd@1$^&*%&%'
};
