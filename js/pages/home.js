
$(document).ready(() => {
    startupHome();
});

const module = {
	
	init: function(firebase) {
        this.startupHome();
    },

    startupHome: function() {
        $("#description-image-toggler").click(() => {
            $("#description-image-toggler img:first-child").toggle();
            $("#description-image-toggler img:last-child").toggle();
        });
    }

};

export default module;