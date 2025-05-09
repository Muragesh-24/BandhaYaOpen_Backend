const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;
const bcrypt = require("bcrypt");
const cors = require("cors");
app.use(cors())

app.use(express.json()); 
require('dotenv').config();




const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


//models/////////////////////////////////////////////////////
const shopSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    shopAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "closed", ""],
        default: "",
    },
}, { timestamps: true });

const Shop = mongoose.model("Shop", shopSchema);



/////////////////////////////////////////////////////////////

//routes/////////////////////////////////////////////////////
app.post("/register", async(req, res) => {
 

  const { shopName, name, email, password, shopAddress, status } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

 const shoper = new Shop({
    shopName,
    name,
    email,
    password:hashedPassword, 
    shopAddress,
    status: "", 
});

await shoper.save(); 

 return res.status(200).json({
    message: "Register successful!",
    success: true, 
});
});




app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
       
        const person = await Shop.findOne({ email });
        
        if (!person) {
            return res.status(404).json({ message: "User not found!" });
        }

        
        const match = await bcrypt.compare(password, person.password);

        if (match) {
            
            

            
          return res.status(200).json({
    message: "Login successful!",
    success: true, 
});

        } else {
            // Passwords don't match
            return res.status(400).json({ message: "Invalid credentials!",
                 success: false,
             });

        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error",success: false,

         });
    }
});

app.post("/toggle",async(req,res)=>{
 const { email, password,status } = req.body;
  const person = await Shop.findOne({ email });
    if (!person) {
            return res.status(404).json({ message: "User not found!" });
        }
    person.status=status
   await person.save();

return res.status(200).json({
    message: "Status updated successfully!"
   
});   

})
app.get("/allShops",async(req,res)=>{
    const allshops= await Shop.find()
    return res.status(200).json({
    
    data : allshops, 
});

})



/////////////////////////////////////////////////////////////
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

