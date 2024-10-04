import { Job } from "../models/job.model.js";

// posting Job
export const postJob = async (req,res) => {
    try {
        const {title ,description ,requirements ,salary,location,jobType,experience,position,companyId} = req.body;
        const userId = req.id;

        if (!title |!description |!requirements |!salary|!location|!jobType|!experience|!position|!companyId) {
            return res.status(400).json({
                message:"Please fill all the Fields",
                success:false
            })
        };

        const job = await Job.create({
            title ,
            description ,
            requirements: requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            exprienceLevel : experience,
            position,
            company:companyId,
            created_by:userId
        });

        return res.status(201).json({
            message:"New Job created Succesfully",
            job,
            success:true            
        });
    } catch (error) {
        console.log(error);
        
    }
}

// Getting all jobs
