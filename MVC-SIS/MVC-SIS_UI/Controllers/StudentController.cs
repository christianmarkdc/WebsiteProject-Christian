using MVC_SIS_Data;
using MVC_SIS_Models;
using MVC_SIS_UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVC_SIS_UI.Controllers
{
    public class StudentController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult List()
        {
            var model = StudentRepository.GetAll();

            return View(model);
        }

        [HttpGet]
        public ActionResult Add()
        {
            var viewModel = new StudentAddVM();
            viewModel.SetCourseItems(CourseRepository.GetAll());
            viewModel.SetMajorItems(MajorRepository.GetAll());
            return View(viewModel);
        }

        [HttpPost]
        public ActionResult Add(StudentAddVM studentVM)
        {
            if (!ModelState.IsValid)
            {
                studentVM = new StudentAddVM();
                studentVM.SetCourseItems(CourseRepository.GetAll());
                studentVM.SetMajorItems(MajorRepository.GetAll());
                return View(studentVM);
            }

            studentVM.Student.Courses = new List<Course>();


            foreach (var id in studentVM.SelectedCourseIds)
                studentVM.Student.Courses.Add(CourseRepository.Get(id));

            studentVM.Student.Major = MajorRepository.Get(studentVM.Student.Major.MajorId);

            StudentRepository.Add(studentVM.Student);

            return RedirectToAction("List");
        }
        [HttpGet]
        public ActionResult Edit(int id)
        {
            StudentEditVM viewModel = new StudentEditVM();
            viewModel.Student= StudentRepository.Get(id);
            viewModel.Student.StudentId = id;
            viewModel.SetCourseItems(CourseRepository.GetAll());
            viewModel.SetMajorItems(MajorRepository.GetAll());
            return View(viewModel);
        }
        [HttpPost]
        public ActionResult Edit(StudentEditVM studentVM)
        {
            if (!ModelState.IsValid)
            {
                studentVM = new StudentEditVM();
                studentVM.SetCourseItems(CourseRepository.GetAll());
                studentVM.SetMajorItems(MajorRepository.GetAll());
                return View(studentVM);
            }

            studentVM.Student.Courses = new List<Course>();


            foreach (var id in studentVM.SelectedCourseIds)
                studentVM.Student.Courses.Add(CourseRepository.Get(id));

            studentVM.Student.Major = MajorRepository.Get(studentVM.Student.Major.MajorId);
           
            StudentRepository.SaveAddress(studentVM.Student.StudentId, studentVM.Student.Address);
            StudentRepository.Edit(studentVM.Student);
            return RedirectToAction("List");
        }
        
        [HttpGet]
        public ActionResult Delete(int id)
        {
            StudentDeleteVM viewModel = new StudentDeleteVM();
            viewModel.student = StudentRepository.Get(id);
            return View(viewModel);
        }
        [HttpPost]
        public ActionResult Delete(StudentDeleteVM viewModel)
        {
            StudentRepository.Delete(viewModel.student.StudentId);
            return RedirectToAction("List");
        }
    }
}