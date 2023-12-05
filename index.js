const express = require('express')
const cors = require("cors");
const { PrismaClient } = require('@prisma/client')
const app = express()
const prisma = new PrismaClient()
const port = 3000
app.use(express.json());
app.use(cors());
require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

async function createDefaultUser() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' },
    });

    if (!existingUser) {
      const defaultUser = await prisma.user.create({
        data: {
          name: 'admin',
          email: 'admin@gmail.com',
          password:'123',
          role:'ADMINISTRATOR'
        },
      });

      console.log('Default user created:', defaultUser);
    } else {
      console.log('Default user already exists.');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultUser();


// works fine add user  
  app.post('/addUser', async (req, res) => {
    try {
      const receivedData = req.body;
    console.log(receivedData)
      let newUser;
      let newRoleEntry;
  
      if (receivedData.role === 'PATIENT') {
        newUser = await prisma.user.create({
          data: {
            name: receivedData.name,
            email: receivedData.email,
            password: receivedData.signuppassword,
            age: parseInt(receivedData.age),
            sex: receivedData.sex,
            phone_number:receivedData.phonenumber,
            role: 'PATIENT',
          },
        });
  
        newRoleEntry = await prisma.patient.create({
          data: {
            patientId: newUser.id,
            health_conditions: 'Good', // Example health condition
          },
        });
      } else if (receivedData.role === 'DOCTOR') {
        newUser = await prisma.user.create({
          data: {
            name: receivedData.name,
            email: receivedData.email,
            password: receivedData.password,
            age: parseInt(receivedData.age),
            sex: receivedData.sex,
            phone_number: receivedData.phone_number,
            role: 'DOCTOR',
          },
        });
        console.log("creating doctor");
        newRoleEntry = await prisma.doctor.create({
          data: {
            doctorId: newUser.id,
            specialization: receivedData.specialization,// Example specialization
          },
        });
  
      } else if (receivedData.role === 'ADMINISTRATOR') {
       
        newUser = await prisma.user.create({
          data: {
            name: receivedData.name,
            email: receivedData.email,
            password: receivedData.password,
            sex: receivedData.sex,
            age:parseInt(receivedData.age),
            role: 'ADMINISTRATOR',
          },
        });
        newRoleEntry = await prisma.administrator.create({
          data: {
            administratorId: newUser.id,
            department: 'Admin', // Example department details
          },
        });
  
        
      } else {
        return res.status(400).json({ error: 'Invalid role' });
      }
  
      res.status(200).json({ message: 'User and role added successfully', newUser,msg2: 'new role', newRoleEntry });
    } catch (error) {
      console.error('Error adding user and role:', error);
      res.status(500).json({ error: 'Error adding user and role' });
    }
  });

  //login validation(works fine)
  app.post('/login', async (req, res) => {
    try {
      const receivedData = req.body;
      console.log(receivedData)
      const user = await prisma.user.findUnique({
        where: {
          email: receivedData.email,
        },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (user.password !== receivedData.password) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
  })


  //patient dashboard
//works fine add appointment
  app.post('/addAppointment', async (req, res) => {
    try {
      const receivedData = req.body;
      console.log(receivedData)
      let newAppointment=await prisma.appointment.create({
        data: {
          patientId: receivedData.patientId,
          doctorId: receivedData.doctorId,
          status: 'SCHEDULED',
          appointment_date: receivedData.appointment_date,
          appointment_time: receivedData.appointment_time
        },
      });
      await prisma.patient.update({
        where: {
          patientId: receivedData.patientId,
        },
        data: {
          health_conditions: receivedData.health_conditions,
        },
      });
      res.status(200).json({ message: 'Appointment added successfully', newAppointment });
    } catch (error) {
      console.error('Error adding user and role:', error);
      res.status(500).json({ error: 'Error adding user and role' });
    }

  })

  //delet appointment 
  // app.delete('/deleteAppointment', async (req, res) => {
  //   try {
  //     const appointmentId = req.body;

  //     const deletedAppointment = await prisma.appointment.delete({
  //       where: {
  //         id: appointmentId,
  //       },
  //     });
  //     res.status(200).json({ deletedAppointment });
  //   } catch (error) {
  //     console.error('Error deleting appointment:', error);
  //     res.status(500).json({ error: 'Error deleting appointment' });
  //   }
  // })

  app.delete('/deleteAppointment', async (req, res) => {
    try {
      const appointmentId = req.body.appointmentId; // Change this line
      const deletedAppointment = await prisma.appointment.delete({
        where: {
          id: appointmentId,
        },
      });
      res.status(200).json({ deletedAppointment });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ error: 'Error deleting appointment' });
    }
  });
  

//get appointments works fine
app.post('/getpatientappointments', async (req, res) => {
  const { id } = req.body;

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: parseInt(id),
      },
      include: {
        doctor: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





  
  // Endpoint to delete a user by email(works fine)
app.delete('/deleteUser', async (req, res) => {
    try {
      const userEmail = req.body.email;
      console.log(userEmail);
      if (!userEmail) {
        return res.status(400).json({ error: 'Email not provided' });
      }
  
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Error deleting user' });
    }
  });
  
//get all users WORKS FINE
app.post('/find', async (req, res) => {
  try {
    const alluser = await prisma.user.findMany(
      {
        where: {
          role:'DOCTOR'
        },
      }

    );
    console.log(alluser);
    res.status(200).json({ alluser });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Error finding user' });
  }
  
})


//find patients all
app.post('/findPatient', async (req, res) => {
  try {
    const alluser = await prisma.user.findMany(
      {
        where: {
          role:'PATIENT'
    
        },
      }

    );
    console.log(alluser);
    res.status(200).json({ alluser });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Error finding user' });
  }
  
})

//find all appointments of patient include doctor name 
app.post('/findAppointment', async (req, res) => {
  const { patientId } = req.body;
  try {
    const allAppointment = await prisma.appointment.findMany(
      {
        where: {
          patientId: patientId
        },
        include: {
          doctor: {
            include:{
              user: { select: { name: true } }
            }
          },
          patient: {
            include: {
              user: { select: { name: true } }
            }
          }

        }
      }
    );
    res.status(200).json({ allAppointment });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Error finding user' });
  }
})

//upafte the status of appointment of particular patient  works fine
app.post('/updateStatus', async (req, res) => {
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: req.body.id, // Assuming req.body.id contains the appointment ID
      },
      data: {
        status: req.body.status,
      },
    });
    res.status(200).json({ updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Error updating appointment status' });
  }
});



//Exectution
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// patient dash for admin
app.post('/getpatient', async (req, res) => {
  try {
    const patients = await prisma.user.findMany({
      where: {
        role: 'PATIENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        sex:true,
        age:true,
        phone_number:true,
        doctor: {
          select: {
            specialization: true,
          },
        },
      },
    });

    console.log(patients);
    res.status(200).json({ patients });
  } catch (error) {
    console.error('Error finding doctors:', error);
    res.status(500).json({ error: 'Error finding patients' });
  }
});

//admin dash for ADMIN
app.post('/getadmin', async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMINISTRATOR',
      },
      select: {
        id: true,
        name: true,
        age: true,
        sex: true,
        password: true, // Include password only if necessary (not recommended)
        email: true,
        administrator: {
          select: {
            user:true,
          },
        }
      },
    });

    console.log(admins);
    res.status(200).json({ admins });
  } catch (error) {
    console.error('Error finding admins:', error.message);
    res.status(500).json({ error: 'Error finding admins' });
  }
});




// doctor dash board  for admin
//getdoctors working
app.post('/getdoctor', async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: 'DOCTOR',
      },
      select: {
        id: true,
        name: true,
        email: true,
        sex:true,
        age:true,
        phone_number:true,
        doctor: {
          select: {
            specialization: true,
          },
        },
      },
    });

    // console.log(doctors);
    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error finding doctors:', error);
    res.status(500).json({ error: 'Error finding doctors' });
  }
});

//deletdoctor with email
app.delete('/removeusr/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Use Prisma to delete the doctor based on email
    const deletedDoctor =  await prisma.user.delete({
      where: {
        email: email,
      },
    });

    res.status(200).json({ success: true, deletedDoctor });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//detete doctor on undo not working
app.delete('/removeDoctor/:id', async (req, res) => {
  const { id } = req.params;
  const removedDoctor = await prisma.doctor.delete({
    where: { id: parseInt(id) },
  });
  res.json(removedDoctor);
});




// for doct table working fine
app.post('/getappointments', async (req, res) => {
  const { doctId } = req.body;

  try {
    // Use Prisma to fetch appointments for the given doctor ID
    const appointmentsForDoctor = await prisma.appointment.findMany({
      where: {
        doctorId: doctId,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
         // Include patient details
      },
    });

    res.json({ appointments: appointmentsForDoctor });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//rejected appointments appointment
app.post('/cancelappointment', async (req, res) => {
  const { appointmentId } = req.body;

  try {
    // Update the appointment status to CANCELLED
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELED' },
    });

    res.json({ success: true, updatedAppointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ success: false, error: 'Error cancelling appointment' });
  }
});

//accepted appointments
app.post('/acceptappointment', async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CONFIRMED' },
    });

    res.json({ success: true, updatedAppointment });
  } catch (error) {
    console.error('Error accepting appointment:', error);
    res.status(500).json({ success: false, error: 'Error accepting appointment' });
  }
});

//done appointments
app.post('/doneappointment', async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'COMPLETED' },
    });

    res.json({ success: true, updatedAppointment });
  } catch (error) {
    console.error('Error accepting appointment:', error);
    res.status(500).json({ success: false, error: 'Error accepting appointment' });
  }
});






// npx prisma generate
// npx prisma migrate dev --name init --create-only
// npx prisma migrate deploy