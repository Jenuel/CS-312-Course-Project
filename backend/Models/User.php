<?php
class User {
    private $firstName
	private $lastName
	private $schoolEmail
	private $password
//Constructor
	public function User($firstName, $lastName, $schoolEmail, $password){
	 	$this->firstName = $firstName;
		$this->lastName = $lastName;
	 	$this->schoolEmail = $schoolEmail;
	 	$this->password = $password;
	}
//Setters
    public function set_firstName($firstName){
	 	$this->firstName = $firstName;
	}
	public function set_lastName($lastName){
		$this->lastName = $lastName;
	}
	public function set_schoolEmail($schoolEmail){
	 	$this->schoolEmail = $schoolEmail;
	}
	public function set_password($password){
	 	$this->password = $password;
	}
//Getters
    public function get_firstName() {
    		return $this->firstName;
  	}
    public function get_lastName() {
    		return $this->lastName;
  	}
    public function get_schoolEmail() {
    		return $this->schoolEmail;
  	}
    public function get_password() {
    		return $this->password;
  	}

}