<?php
class Booth{
    private $title
    private $Description
    private $Schedules
    private $location
    private $Organization
      // Constructor
      public function __construct($title = "", $description = "", $schedules = [], $location = "") {
        $this->title = $title;
        $this->description = $description;
        $this->schedules = $schedules;
        $this->location = $location;
    }

    // Getters
    public function getTitle() {
        return $this->title;
    }

    public function getDescription() {
        return $this->description;
    }

    public function getSchedules() {
        return $this->schedules;
    }

    public function getLocation() {
        return $this->location;
    }
    public function getLocation() {
        return $this->Organization;
    }

    // Setters
    public function setTitle($title) {
        $this->title = $title;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    public function setSchedules($schedules) {
        $this->schedules = $schedules;
    }

    public function setLocation($location) {
        $this->location = $location;
    }
    public function setLocation($Organization) {
        $this->Organization = $Organization;
    }
}