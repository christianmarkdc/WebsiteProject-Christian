using MVC_SIS_Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace MVC_SIS_UI.Models
{
    public class AddStateVM: IValidatableObject
    {
    
        public State currentState { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            List<ValidationResult> errors = new List<ValidationResult>();

            if (currentState.StateName == "" || currentState.StateName == null)
            {
                errors.Add(new ValidationResult("Please enter a State Name",
                    new[] { "currentState.StateName" }));
            }
            if(currentState.StateAbbreviation == "" || currentState.StateAbbreviation == null)
            {
                errors.Add(new ValidationResult("Please enter a State Abreiviation",
                    new[] { "currentState.StateAbrreviation" }));
            }
            return errors;
        }
    }
}