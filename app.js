const express = require('express');
const app = express();
const Joi = require('joi');
const port = process.env.PORT || 3000;
app.use(express.json());
var courses = [
    {id:1,name: 'esc101' },
    {id:2,name: 'mth101'},
    {id:3,name : 'lif101'}
    
]
validateCourse  = (course) =>{
  const schema = {
    name : Joi.string().min(6).required()
  }
  return Joi.validate(course,schema);
}

app.get('/', ( req,res )=>{
    res.send('Hello, Kamine!');
})
app.get('/api/courses/',(req,res)=>{console.log(module);
    res.json(
        courses
    );
})
app.get('/api/course/:id',(req,res)=>{
    const course= courses.find(c => c.id == parseInt(req.params.id));
    if(! course){
        res.status(404).send("Course that you are looking for is not available at this website.");
        return;
    }
    res.json(course);
    
});
app.post('/api/addCourse',(req,res)=>{
    const { error } = validateCourse(req.body);
    if(!error){
        const course = {
            id: courses[courses.length-1].id+1,
            name : req.body.name
        }
        courses.push(course);
        res.send(`you added successfully ${ course.name } to our databases`);
        return;
    }
    console.log(error.details[0].message);
    res.status(400).send( error.details[0].message );
})
app.put('/api/updateCourse/:id',(req,res)=>{
    const checkExistence= courses.find(c => c.id == parseInt(req.params.id));
    if(! checkExistence){
        res.status(404).send("Course that you are updating does not exist in our database.");
        return;
    }
    const { error } = validateCourse(req.body);
    if(!error){
        courses = courses.map(c =>{
            if(c.id == parseInt(req.params.id)){
                return {
                    id: c.id,
                    name:req.body.name,
                }
            }
            return c;
        })
        res.send(`you updated successfully course: ${ req.body.name } to our databases`);
        return;
    }
    res.status(400).send(error.details[0].message);

})
app.delete('/api/removeCourse/:id',(req,res) => {
    const checkExistence= courses.find(c => c.id == parseInt(req.params.id));
    if(! checkExistence){
        res.status(404).send("Course that you want to remove does not exist in our database.");
        return;
    }
    //console.log(courses);
    const courseName = courses[parseInt(req.params.id)-1].name;
    
    const courses1 = courses.filter(c => {
        return c.id !== parseInt(req.params.id);
        //console.log(courses,parseInt(req.params.id));
    })
    courses = courses1;
    console.log(courses);
    res.send(`Course : ${ courseName} removed successfully`);

})
app.listen(port,()=>{
    console.log(`app is listening at ${port}`)
})