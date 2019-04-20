const moment = require('moment');

module.exports = {

    select: function(selected, options){    
        

        //parameter selected is 'post.status' in {{#select _____ }} in edit.handlebars
        // parameter 'option' is elements between {{#select}} and {{'select}} in edit.handlerbars


        console.log(selected + '- This logged from helpers => handlebars-helpers.js');

        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'),'$& selected = "selected"');  //to be configured

    },

    generateDate: function(date,format){

        return moment(date).format(format);
    },

    paginate: function(options){

        let output = '';
        
        if(options.hash.current === 1){

            output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;

        }

        else{

            output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
 
        }

        //First pages dots
        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1  );

        if(i !== 1){

            output += `<li class="page-item disabled"><a class="page-link">...</a></li>` ;

        }

        //Page numbering in between

        for(;i<= (Number(options.hash.current) + 4) && i<= options.hash.pages; i++){

            if(i === options.hash.current){

                output += `<li class="page-item active"><a class="page-link">${i}</a></li>` ;
            }

            else{

                output += `<li class="page-item"><a href="?page=${i}" class="page-link">${i}</a></li>` ;

            }


            //Last Pages dots
            if(i === Number(options.hash.current) + 4 && i< options.hash.pages){

                output += `<li class="page-item disabled"><a class="page-link">...</a></li>` ;
            }
            //Last Pages dots

        }

        // Last Page 
        
        if(options.hash.current === options.hash.pages){

            output += `<li class="page-item disabled"><a class="page-link">Last</a></li>` ;
        }
        
        else{

            output += `<li class="page-item"><a href="?page=${options.hash.pages}" class="page-link">Last</a></li>` ;
        }

        return output;
    }
};