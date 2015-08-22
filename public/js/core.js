var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
  $scope.formData = {};
  $scope.hideorshow = true;
// when landing on the page, get all todos and show them
$http.get('/api/todos')
.success(function(data) {
  $scope.todos = data;
  console.log(data);
})
.error(function(data) {
  console.log('Error: ' + data);
});

// when submitting the add form, send the text to the node API
$scope.createTodo = function() {
  $http.post('/api/todos', $scope.formData)
  .success(function(data) {
            $scope.formData = {}; // clear the form so our user is ready to enter another
            $scope.todos = data;
            console.log(data);
          })
  .error(function(data) {
    console.log('Error: ' + data);
  });
};

// delete a todo after checking it
$scope.deleteTodo = function(id) {
  $http.delete('/api/todos/' + id)
  .success(function(data) {
    $scope.todos = data;
    $scope.formData = {};
    $scope.hideorshow = true;
    console.log(data);
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });
};

$scope.togglehide=function(id){
  // get one todo prepare for update
  $http.get('/api/todos/'+id)
  .success(function(data){
    $scope.formData.text = data.text;
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });

  $scope.hideorshow=!$scope.hideorshow;
  $scope.formData.id = id;

};

$scope.update=function(id){
  $http.put('/api/todos/' + id,$scope.formData)
  .success(function(data) {
    $scope.todos = data;
    $scope.formData = {};
    $scope.hideorshow = true;
    console.log(data);
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });
  
};

}