class recebController{
    recebView(req, res){
        res.render('recebimento', {layout: true});
    }
}

module.exports = recebController;